package com.proiect.tpd.CodeAssist.service.memory;

import jakarta.annotation.PostConstruct;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;

import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import java.time.Instant;
import java.util.*;

@Service
@RequiredArgsConstructor
public class QdrantMemoryService implements MemoryService {

    private final RestTemplate restTemplate = new RestTemplate();

    @Value("${qdrant.url}")
    private String qdrantUrl;

    @PostConstruct
    public void init() {
        try {
            restTemplate.put(
                    qdrantUrl + "/collections/agent_memory",
                    Map.of(
                            "vectors", Map.of(
                                    "size", 384,
                                    "distance", "Cosine"
                            )
                    )
            );
        } catch (Exception e) {
            // colecția există deja → OK
        }
    }


    @Override
    public void saveSummary(String projectId, String summary, Set<String> focus) {

        List<Float> vector = Collections.nCopies(384, 0.0f);

        Map<String, Object> payload = Map.of(
                "projectId", projectId,
                "summary", summary,
                "focus", focus,
                "timestamp", Instant.now().toString()
        );

        Map<String, Object> point = Map.of(
                "id", UUID.randomUUID().toString(),
                "vector", vector,
                "payload", payload
        );

        Map<String, Object> body = Map.of(
                "points", List.of(point)
        );

        restTemplate.put(
                qdrantUrl + "/collections/agent_memory/points",
                body
        );
    }



    @Override
    public List<String> searchSummaries(String projectId, int limit) {

        Map<String, Object> filter = Map.of(
                "must", List.of(
                        Map.of(
                                "key", "projectId",
                                "match", Map.of("value", projectId)
                        )
                )
        );

        Map<String, Object> body = Map.of(
                "vector", new float[384], // dummy
                "limit", limit,
                "filter", filter,
                "with_payload", true
        );

        Map response = restTemplate.postForObject(
                qdrantUrl + "/collections/agent_memory/points/search",
                body,
                Map.class
        );

        List<Map<String, Object>> result =
                (List<Map<String, Object>>) response.get("result");

        System.out.println(result.toString());

        return result.stream()
                .map(r -> (Map<String, Object>) r.get("payload"))
                .filter(Objects::nonNull)              // 🔥 CHEIA
                .map(p -> (String) p.get("summary"))
                .filter(Objects::nonNull)              // 🔥 CHEIA
                .toList();
    }

}
