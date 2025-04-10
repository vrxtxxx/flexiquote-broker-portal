
package com.insurance.quotemanager.repository;

import com.insurance.quotemanager.model.Broker;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;
import java.util.UUID;

@Repository
public interface BrokerRepository extends JpaRepository<Broker, UUID> {
    Optional<Broker> findByEmail(String email);
}
