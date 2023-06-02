package com.vraj.blogapplication.services;
/*
    vrajshah 30/04/2023
*/

import com.vraj.blogapplication.models.entities.Category;
import com.vraj.blogapplication.repositories.interfaces.CategoryRepository;
import com.vraj.blogapplication.services.interfaces.CategoryService;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.util.List;

@Slf4j
@Service
public class CategoryServiceImpl implements CategoryService {
    private final CategoryRepository categoryRepository;

    public CategoryServiceImpl(CategoryRepository categoryRepository) {
        this.categoryRepository = categoryRepository;
    }

    @Override
    public List<Category> get() {
        List<Category> categories = categoryRepository.findAll();
        return categories;
    }

}
