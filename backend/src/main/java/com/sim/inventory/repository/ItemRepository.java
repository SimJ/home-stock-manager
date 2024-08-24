package com.sim.inventory.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.sim.inventory.model.Item;

public interface ItemRepository extends JpaRepository<Item, Long> {

}
