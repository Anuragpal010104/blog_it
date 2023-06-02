package com.vraj.blogapplication.repositories.interfaces;

import com.vraj.blogapplication.models.entities.Category;
import org.springframework.data.jpa.repository.JpaRepository;

public interface CategoryRepository extends JpaRepository<Category, Long> {
}
