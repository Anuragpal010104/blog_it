package com.vraj.blogapplication.services.interfaces;

import com.vraj.blogapplication.models.CommentDto;
import com.vraj.blogapplication.models.entities.Comment;
import com.vraj.blogapplication.models.payloads.CommentRequest;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;

public interface CommentService {

    Page<Comment> findAllByBlogId(PageRequest pageRequest, Long blogId);
    void createComment(CommentRequest commentRequest);
    void deleteById(Long commentId);

}
