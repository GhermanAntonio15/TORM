package com.proiect.tpd.CodeAssist.service.memory;

import java.util.List;
import java.util.Set;

public interface MemoryService {

    void saveSummary(
            String projectId,
            String summary,
            Set<String> focus
    );

    List<String> searchSummaries(
            String projectId,
            int limit
    );
}
