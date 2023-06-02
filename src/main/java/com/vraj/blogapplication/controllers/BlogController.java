package com.vraj.blogapplication.controllers;
/*
    vrajshah 14/05/2023
*/

import com.vraj.blogapplication.models.Paging;
import com.vraj.blogapplication.models.entities.Blog;
import com.vraj.blogapplication.models.payloads.AddBlogRequest;
import com.vraj.blogapplication.services.interfaces.BlogService;
import com.vraj.blogapplication.utils.Helper;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Sort;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/blogs")
public class BlogController {

    private final BlogService blogService;

    public BlogController(BlogService blogService) {
        this.blogService = blogService;
    }

    @GetMapping("/getBlogs")
    public ResponseEntity<?> getBlogs(
            @RequestParam(name = "page_no", required = false) int pageNo,
            @RequestParam(name = "limit", required = false) int limit,
            @RequestParam(name = "category", required = false) Long category
    ) {
        PageRequest pageRequest = PageRequest
                .of(pageNo, limit)
                .withSort(Sort.Direction.DESC, "createdOn");
        if (category != null) {
            Page<Blog> blogs = blogService.getBlogsWithCategory(pageRequest, category, false);
            Paging<Blog> pagedResult = new Paging<>(
                    blogs.getContent(),
                    blogs.hasNext()
            );
            return ResponseEntity.ok(pagedResult);
        }
        Page<Blog> blogs = blogService.getBlogs(pageRequest, false);
        Paging<Blog> pagedResult = new Paging<>(
                blogs.getContent(),
                blogs.hasNext()
        );
        return ResponseEntity.ok(pagedResult);
    }

    @GetMapping("/users/{userId}")
    public ResponseEntity<?> getBlogsByUser(
            @RequestParam(name = "page_no") int pageNo,
            @RequestParam(name = "limit", required = false) int limit,
            @PathVariable(name = "userId") Long userId) {
        PageRequest pageRequest = PageRequest
                .of(pageNo, limit)
                .withSort(Sort.Direction.DESC, "createdOn");
        Page<Blog> blogs = blogService.getBlogsByUser(pageRequest, userId);
        Paging<Blog> pagedResult = new Paging<>(
                blogs.getContent(),
                blogs.hasNext()
        );
        return ResponseEntity.ok(pagedResult);
    }

    @GetMapping("/my-blogs")
    public ResponseEntity<?> getBlogsByUser(
            @RequestParam(name = "page_no") int pageNo,
            @RequestParam(name = "limit") int limit) {
        PageRequest pageRequest = PageRequest
                .of(pageNo, limit)
                .withSort(Sort.Direction.DESC, "createdOn");
        Long userId = Helper.getLoggedInUserDetails().getUser().getId();
        Page<Blog> blogs = blogService.getBlogsByUser(pageRequest, userId);
        return ResponseEntity.ok(blogs.getContent());
    }

    @GetMapping("/{blog_slug}")
    public ResponseEntity<?> getBlog(@PathVariable(name = "blog_slug") String blogSlug) {
        Blog blog = blogService.getBlogBySlug(blogSlug);
        return ResponseEntity.ok(blog);
    }

    @PostMapping("/")
    public ResponseEntity<?> addBlog(@RequestBody AddBlogRequest blogRequest) {
        String blogSlug = blogService.addBlog(blogRequest);
        return ResponseEntity.ok(blogSlug);
    }

    @DeleteMapping("/{blog_id}")
    public ResponseEntity<?> deleteBlogById(@PathVariable(name = "blog_id") long blogId) {
        blogService.deleteBlogById(blogId);
        return ResponseEntity.ok("Blog deleted successfully");
    }

}
