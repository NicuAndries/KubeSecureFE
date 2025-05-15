package com.k8security.dashboard.model;

import com.vladmihalcea.hibernate.type.json.JsonBinaryType;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.hibernate.annotations.Type;

import java.time.LocalDateTime;
import java.util.List;

@Entity
@Table(name = "response_actions")
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ResponseAction {
    
    @Id
    private String id;
    
    @Column(nullable = false)
    private String name;
    
    @Column(nullable = false, columnDefinition = "text")
    private String description;
    
    @Column(nullable = false)
    private Boolean automated;
    
    @Column(nullable = false)
    private Boolean enabled;
    
    @Column(name = "last_executed", nullable = false)
    private String lastExecuted;
    
    @Column(nullable = false)
    private String target;
    
    @Type(JsonBinaryType.class)
    @Column(name = "applicable_threats", columnDefinition = "jsonb")
    private List<String> applicableThreats;
    
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