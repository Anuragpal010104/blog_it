package com.vraj.blogapplication.controllers;
/*
    vrajshah 02/06/2023
*/

import com.vraj.blogapplication.models.CommentDto;
import com.vraj.blogapplication.models.Paging;
import com.vraj.blogapplication.models.entities.Comment;
import com.vraj.blogapplication.models.payloads.CommentRequest;
import com.vraj.blogapplication.services.interfaces.CommentService;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Sort;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import javax.validation.Valid;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/comments")
public class CommentController {

    private final CommentService commentService;

    public CommentController(CommentService commentService) {
        this.commentService = commentService;
    }

    @GetMapping("/{blogId}")
    public ResponseEntity<?> getCommentsByBlogId(@PathVariable(name = "blogId") Long blogId,
                                                 @RequestParam(name = "page_no", required = false) int pageNo,
                                                 @RequestParam(name = "limit", required = false) int limit
    ) {
        PageRequest pageRequest = PageRequest
                .of(pageNo, limit)
                .withSort(Sort.Direction.DESC, "createdOn");
        Page<Comment> comments = commentService.findAllByBlogId(pageRequest, blogId);
        Paging<CommentDto> pagedResult = new Paging<>(
                comments.getContent().stream().map(c ->
                        new CommentDto(
                                c.getId(),
                                c.getComment(),
                                c.getUser().getName(),
                                c.getCreatedOn()
                        )
                ).collect(Collectors.toList()),
                comments.hasNext()
        );
        return ResponseEntity.ok(pagedResult);
    }

    @PostMapping("/")
    public ResponseEntity<?> createComment(@Valid @RequestBody CommentRequest commentRequest) {
        commentService.createComment(commentRequest);
        return ResponseEntity.ok("Comment added.");
    }

    @DeleteMapping("/{commentId}")
    public ResponseEntity<?> deleteCommentById(@PathVariable(name = "commentId") Long commentId) {
        commentService.deleteById(commentId);
        return ResponseEntity.ok("Comment deleted successfully.");
    }
}
