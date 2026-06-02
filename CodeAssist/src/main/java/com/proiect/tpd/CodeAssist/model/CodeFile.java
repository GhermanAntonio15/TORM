package com.proiect.tpd.CodeAssist.model;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class CodeFile {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String filename;

    @Column(columnDefinition = "TEXT")
    private String content;

    private String language;
}
