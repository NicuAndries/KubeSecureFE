package com.k8security.dashboard.model;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Entity
@Table(name = "kpi_data")
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class KpiData {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @Column(name = "security_score", nullable = false)
    private Integer securityScore;
    
    @Column(name = "active_threat_total", nullable = false)
    private Integer activeThreatTotal;
    
    @Column(name = "active_threat_change", nullable = false)
    private Integer activeThreatChange;
    
    @Column(name = "active_threat_critical", nullable = false)
    private Integer activeThreatCritical;
    
    @Column(name = "active_threat_high", nullable = false)
    private Integer activeThreatHigh;
    
    @Column(name = "active_threat_medium", nullable = false)
    private Integer activeThreatMedium;
    
    @Column(name = "active_threat_low", nullable = false)
    private Integer activeThreatLow;
    
    @Column(name = "vulnerable_containers_affected", nullable = false)
    private Integer vulnerableContainersAffected;
    
    @Column(name = "vulnerable_containers_total", nullable = false)
    private Integer vulnerableContainersTotal;
    
    @Column(name = "compliance_percentage", nullable = false)
    private Integer compliancePercentage;
    
    @Column(name = "compliance_change", nullable = false)
    private Integer complianceChange;
    
    @Column(name = "compliance_pci_dss", nullable = false)
    private Boolean compliancePciDss;
    
    @Column(name = "compliance_gdpr", nullable = false)
    private Boolean complianceGdpr;
    
    @Column(name = "compliance_hipaa", nullable = false)
    private Boolean complianceHipaa;
    
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