package com.vraj.blogapplication.repositories.interfaces;
/*
    vrajshah 14/05/2023
*/

import com.vraj.blogapplication.models.entities.Blog;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;

import java.util.Optional;

public interface BlogRepository extends JpaRepository<Blog, Long> {

    Page<Blog> findBlogsByDeletedFalse(PageRequest pageRequest);

    Page<Blog> findBlogsByUser_Id(PageRequest pageRequest, Long userId);

    @Query("select b from Blog b where b.category.id =:category and b.deleted=false")
    Page<Blog> findBlogsByCategory(PageRequest pageRequest, Long category);

    Optional<Blog> findBlogBySlugIgnoreCase(String slugTitle);

    @Query("update Blog b set b.views =:views, b.lastModifiedOn = current_timestamp WHERE b.id=:blogId")
    @Modifying(clearAutomatically = true)
    void increaseViews(Long blogId, long views);

    @Query("update Blog b set b.deleted = true, b.lastModifiedOn = current_timestamp WHERE b.id =:blogId")
    @Modifying(clearAutomatically = true)
    void deleteBlogById(Long blogId);

}
