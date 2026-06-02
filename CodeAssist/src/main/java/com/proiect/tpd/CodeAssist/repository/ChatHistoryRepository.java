package com.proiect.tpd.CodeAssist.repository;

import com.proiect.tpd.CodeAssist.model.ChatHistory;
import org.springframework.data.jpa.repository.JpaRepository;

public interface ChatHistoryRepository extends JpaRepository<ChatHistory, Long> {
}