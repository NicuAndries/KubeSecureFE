package com.k8security.dashboard.model;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Entity
@Table(name = "threat_activity")
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ThreatActivity {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @Column(nullable = false)
    private String time;
    
    @Column(nullable = false)
    private Integer critical;
    
    @Column(nullable = false)
    private Integer high;
    
    @Column(nullable = false)
    private Integer medium;
    
    @Column(nullable = false)
    private Integer low;
    
    @Column(nullable = false)
    private String range;
    
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