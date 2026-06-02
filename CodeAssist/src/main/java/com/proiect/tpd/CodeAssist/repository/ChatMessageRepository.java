package com.proiect.tpd.CodeAssist.repository;

import com.proiect.tpd.CodeAssist.model.ChatMessage;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface ChatMessageRepository extends JpaRepository<ChatMessage, Long> {

    List<ChatMessage> findBySessionIdOrderByIdAsc(String sessionId);
}
