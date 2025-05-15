package com.k8security.dashboard.model;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Entity
@Table(name = "action_history")
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ActionHistory {
    
    @Id
    private String id;
    
    @Column(nullable = false)
    private String action;
    
    @Column(nullable = false)
    private String target;
    
    @Column(nullable = false)
    private String threat;
    
    @Column(nullable = false)
    private String result;
    
    @Column(nullable = false)
    private String timestamp;
    
    @Column(nullable = false)
    private String user;
    
    @Column(name = "created_at")
    private LocalDateTime createdAt;
    
    @Column(name = "updated_at")
    private LocalDateTime updatedAt;
    
    @PrePersist
    protected void onCreate() {
        createdAt = LocalDateTime.now();
        updatedAt = LocalDateTime.now();
    }
    
    @PreUpdate
    protected void onUpdate() {
        updatedAt = LocalDateTime.now();
    }
}