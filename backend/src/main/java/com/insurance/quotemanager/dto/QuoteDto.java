
package com.insurance.quotemanager.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class QuoteDto {
    private UUID id;
    private String fullName;
    private String email;
    private String phone;
    private String residentialAddress;
    private LocalDate dateOfBirth;
    private String propertyType;
    private String constructionType;
    private Integer yearOfConstruction;
    private BigDecimal totalSquareArea;
    private Integer numberOfRooms;
    private Integer numberOfBathrooms;
    private Integer numberOfFloors;
    private Boolean isOccupiedFullTime;
    private BigDecimal sumInsured;
    private LocalDate policyStartDate;
    private LocalDate policyEndDate;
    private String policyDuration;
    private String renewalType;
    private Boolean automaticRenewal;
    private Boolean nearbyFireStation;
    private Boolean highValueItems;
    private List<String> fireSafetyMeasures;
    private String fireSafetyOther;
    private List<String> securityFeatures;
    private String securityFeaturesOther;
    private String insuranceType;
    private String status;
    private BigDecimal premium;
    private UUID brokerId;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}
