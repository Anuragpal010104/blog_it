package com.vraj.blogapplication.models.entities;
/*
    vrajshah 02/06/2023
*/

import com.vraj.blogapplication.models.enums.Action;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import javax.persistence.*;

@Entity
@Table(name = "blog_actions")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class BlogAction extends Base{

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "user_id")
    private User user;

    private Action action;

}

