
package com.insurance.quotemanager.repository;

import com.insurance.quotemanager.model.Quote;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.UUID;

@Repository
public interface QuoteRepository extends JpaRepository<Quote, UUID> {
    List<Quote> findByBrokerId(UUID brokerId);
    List<Quote> findByStatus(String status);
    List<Quote> findByBrokerIdAndStatus(UUID brokerId, String status);
}
