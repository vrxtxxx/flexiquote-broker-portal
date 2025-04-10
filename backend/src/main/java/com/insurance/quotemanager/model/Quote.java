
package com.insurance.quotemanager.model;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.annotation.LastModifiedDate;
import org.springframework.data.jpa.domain.support.AuditingEntityListener;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;

@Entity
@Table(name = "quotes")
@Data
@NoArgsConstructor
@AllArgsConstructor
@EntityListeners(AuditingEntityListener.class)
public class Quote {
    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    @Column(nullable = false)
    private String fullName;

    @Column(nullable = false)
    private String email;

    private String phone;

    @Column(nullable = false)
    private String residentialAddress;

    private LocalDate dateOfBirth;

    private String propertyType;
    
    private String constructionType;
    
    private Integer yearOfConstruction;
    
    private BigDecimal totalSquareArea;
    
    private Integer numberOfRooms;
    
    private Integer numberOfBathrooms;
    
    private Integer numberOfFloors;
    
    @Column(nullable = false)
    private Boolean isOccupiedFullTime = true;
    
    @Column(nullable = false)
    private BigDecimal sumInsured;
    
    @Column(nullable = false)
    private LocalDate policyStartDate;
    
    @Column(nullable = false)
    private LocalDate policyEndDate;
    
    @Column(nullable = false)
    private String policyDuration;
    
    @Column(nullable = false)
    private String renewalType;
    
    @Column(nullable = false)
    private Boolean automaticRenewal = true;
    
    private Boolean nearbyFireStation;
    
    private Boolean highValueItems;
    
    @ElementCollection
    @CollectionTable(name = "quote_fire_safety_measures", joinColumns = @JoinColumn(name = "quote_id"))
    @Column(name = "measure")
    private List<String> fireSafetyMeasures;
    
    private String fireSafetyOther;
    
    @ElementCollection
    @CollectionTable(name = "quote_security_features", joinColumns = @JoinColumn(name = "quote_id"))
    @Column(name = "feature")
    private List<String> securityFeatures;
    
    private String securityFeaturesOther;
    
    @Column(nullable = false)
    private String insuranceType;
    
    @Column(nullable = false)
    private String status = "draft";
    
    @Column(nullable = false)
    private BigDecimal premium = BigDecimal.ZERO;
    
    @ManyToOne
    @JoinColumn(name = "broker_id", nullable = false)
    private Broker broker;
    
    @CreatedDate
    @Column(nullable = false, updatable = false)
    private LocalDateTime createdAt;
    
    @LastModifiedDate
    @Column(nullable = false)
    private LocalDateTime updatedAt;
}
