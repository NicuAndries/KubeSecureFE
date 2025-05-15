package com.k8security.dashboard.model;

import com.vladmihalcea.hibernate.type.json.JsonBinaryType;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.hibernate.annotations.Type;

import java.time.LocalDateTime;
import java.util.Map;

@Entity
@Table(name = "threats")
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class Threat {
    
    @Id
    private String id;
    
    @Column(nullable = false)
    private String severity;
    
    @Column(nullable = false)
    private String type;
    
    @Column(nullable = false)
    private String target;
    
    @Column(nullable = false)
    private String namespace;
    
    @Column(name = "detected_at", nullable = false)
    private String detectedAt;
    
    @Column(nullable = false)
    private String status;
    
    @Column
    private String description;
    
    @Column(name = "pod_name")
    private String podName;
    
    @Type(JsonBinaryType.class)
    @Column(columnDefinition = "jsonb")
    private Map<String, Object> details;
    
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