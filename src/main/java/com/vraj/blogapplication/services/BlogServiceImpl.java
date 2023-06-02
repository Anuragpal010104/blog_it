package com.vraj.blogapplication.services;
/*
    vrajshah 14/05/2023
*/

import com.github.slugify.Slugify;
import com.vraj.blogapplication.exceptions.StatusException;
import com.vraj.blogapplication.models.entities.Blog;
import com.vraj.blogapplication.models.entities.Category;
import com.vraj.blogapplication.models.payloads.AddBlogRequest;
import com.vraj.blogapplication.repositories.interfaces.BlogRepository;
import com.vraj.blogapplication.repositories.interfaces.CategoryRepository;
import com.vraj.blogapplication.services.interfaces.BlogService;
import com.vraj.blogapplication.utils.Helper;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;

import javax.transaction.Transactional;
import java.sql.Timestamp;
import java.time.Instant;
import java.util.Locale;
import java.util.Optional;

@Slf4j
@Service
public class BlogServiceImpl implements BlogService {

    private final BlogRepository blogRepository;
    private final CategoryRepository categoryRepository;
    private final Slugify slg = Slugify.builder()
            .lowerCase(true)
            .underscoreSeparator(true)
            .locale(Locale.ENGLISH)
            .build();

    public BlogServiceImpl(BlogRepository blogRepository, CategoryRepository categoryRepository) {
        this.blogRepository = blogRepository;
        this.categoryRepository = categoryRepository;
    }

    @Override
    public Page<Blog> getBlogs(PageRequest pageRequest, boolean includeDeleted) {
        if (includeDeleted) {
            return blogRepository.findAll(pageRequest);
        }
        return blogRepository.findBlogsByDeletedFalse(pageRequest);
    }

    @Override
    public Page<Blog> getBlogsByUser(PageRequest pageRequest, Long userId) {
        return blogRepository.findBlogsByUser_Id(pageRequest, userId);
    }

    @Override
    @Transactional
    public Blog getBlogBySlug(String slugTitle) {
        log.info("Fetching blog by {}.", slugTitle);
        Blog blog = blogRepository.findBlogBySlugIgnoreCase(slugTitle)
                .orElseThrow(
                        () -> new StatusException("Invalid url.", HttpStatus.UNPROCESSABLE_ENTITY)
                );
        blogRepository.increaseViews(blog.getId(), blog.getViews() + 1);
        return blog;
    }

    @Override
    public String addBlog(AddBlogRequest blogRequest) {
        Category category = categoryRepository.findById(blogRequest.getCategory())
                .orElseThrow(() -> new StatusException("Invalid category", HttpStatus.UNPROCESSABLE_ENTITY));
        Blog blog = Blog.builder()
                .title(blogRequest.getTitle())
                .thumbnail(blogRequest.getThumbnail())
                .content(blogRequest.getContent())
                .slug(slg.slugify(blogRequest.getTitle() + "_" + Timestamp.from(Instant.now()).getTime()))
                .user(Helper.getLoggedInUserDetails().getUser())
                .category(category)
                .views(0L)
                .build();
        blog = blogRepository.save(blog);
        return blog.getSlug();
    }

    @Override
    @Transactional
    public void deleteBlogById(Long blogId) {
        log.info("Deleting blog with id {}", blogId);
        Optional<Blog> blog = blogRepository.findById(blogId);
        if (blog.isEmpty())
            return;
        if (blog.get().getUser().getId().equals(Helper.getLoggedInUserDetails().getUser().getId()))
            blogRepository.deleteBlogById(blogId);
    }

    @Override
    public Page<Blog> getBlogsWithCategory(PageRequest pageRequest, Long category, boolean includeDeleted) {
        return blogRepository.findBlogsByCategory(pageRequest, category);
    }
}
