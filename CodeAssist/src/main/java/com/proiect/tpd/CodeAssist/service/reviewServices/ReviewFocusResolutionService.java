package com.proiect.tpd.CodeAssist.service.reviewServices;

import com.proiect.tpd.CodeAssist.model.ReviewFocus;
import org.springframework.stereotype.Service;

import java.util.EnumSet;
import java.util.Set;

@Service
public class ReviewFocusResolutionService {

    public EnumSet<ReviewFocus> resolve(Set<String> input)
    {
        if(input == null || input.isEmpty() || input.contains("ALL"))
        {
            return EnumSet.of(
                    ReviewFocus.BUGS,
                    ReviewFocus.READABILITY,
                    ReviewFocus.PERFORMANCE,
                    ReviewFocus.CODE_QUALITY,
                    ReviewFocus.CODE_SMELLS,
                    ReviewFocus.SECURITY
            );
        }

        EnumSet<ReviewFocus> resolved = EnumSet.noneOf(ReviewFocus.class);

        for(String value : input)
        {
            resolved.add(ReviewFocus.valueOf(value));
        }
        return resolved;
    }
}
