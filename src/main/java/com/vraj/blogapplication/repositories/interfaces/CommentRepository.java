package com.vraj.blogapplication.repositories.interfaces;
/*
    vrajshah 02/06/2023
*/

import com.vraj.blogapplication.models.CommentDto;
import com.vraj.blogapplication.models.entities.Comment;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

public interface CommentRepository extends JpaRepository<Comment,Long> {

    Page<Comment> findCommentsByBlog_IdAndDeletedFalse(PageRequest pageRequest, Long blogId);

}
