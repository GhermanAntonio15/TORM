package com.proiect.tpd.CodeAssist.model;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class ChatMessage {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String role;

    @Column(columnDefinition = "TEXT")
    private String content;

    private String sessionId;
}
