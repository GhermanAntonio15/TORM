package com.proiect.tpd.CodeAssist.model.agent;

import lombok.AllArgsConstructor;
import lombok.NoArgsConstructor;

import java.util.ArrayList;
import java.util.List;

@NoArgsConstructor
@AllArgsConstructor
public class AgentPlan {
    private List<String> steps;

    public static AgentPlan defaultPlan(List<String> focus) {
        List<String> steps = new ArrayList<>();
        steps.add("Analyze code structure");

        if (focus.contains("Security")) {
            steps.add("Analyze security issues");
        }
        if (focus.contains("CodeQuality")) {
            steps.add("Analyze code quality");
        }

        steps.add("Generate suggestions");
        steps.add("Summarize results");

        return new AgentPlan(steps);
    }
}

