package com.vraj.blogapplication.services;
/*
    vrajshah 02/06/2023
*/

import com.vraj.blogapplication.exceptions.StatusException;
import com.vraj.blogapplication.models.CommentDto;
import com.vraj.blogapplication.models.entities.Blog;
import com.vraj.blogapplication.models.entities.Comment;
import com.vraj.blogapplication.models.entities.User;
import com.vraj.blogapplication.models.payloads.CommentRequest;
import com.vraj.blogapplication.repositories.interfaces.BlogRepository;
import com.vraj.blogapplication.repositories.interfaces.CommentRepository;
import com.vraj.blogapplication.repositories.interfaces.UserRepository;
import com.vraj.blogapplication.services.interfaces.CommentService;
import com.vraj.blogapplication.utils.Helper;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;

@Slf4j
@Service
public class CommentServiceImpl implements CommentService {
    private final CommentRepository commentRepository;
    private final BlogRepository blogRepository;

    public CommentServiceImpl(CommentRepository commentRepository, BlogRepository blogRepository) {
        this.commentRepository = commentRepository;
        this.blogRepository = blogRepository;
    }

    @Override
    public Page<Comment> findAllByBlogId(PageRequest pageRequest, Long blogId) {
        log.info("Fetching comments for blog {}",blogId);
        Page<Comment> comments = commentRepository.findCommentsByBlog_IdAndDeletedFalse(pageRequest,blogId);
        return comments;
    }

    @Override
    public void createComment(CommentRequest commentRequest) {
        Blog blog = blogRepository.findById(commentRequest.getBlogId())
                .orElseThrow(
                        ()->new StatusException("Invalid blog.", HttpStatus.UNPROCESSABLE_ENTITY)
                );
        User user = Helper.getLoggedInUserDetails().getUser();
        Comment comment = Comment
                .builder()
                .comment(commentRequest.getComment())
                .blog(blog)
                .user(user)
                .build();
        commentRepository.save(comment);
    }

    @Override
    public void deleteById(Long commentId) {
        commentRepository.deleteById(commentId);
    }
}
