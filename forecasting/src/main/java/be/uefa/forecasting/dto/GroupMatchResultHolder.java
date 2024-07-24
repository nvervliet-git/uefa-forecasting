package be.uefa.forecasting.dto;

import java.util.List;

public record GroupMatchResultHolder(Long id, String groupName, Integer groupOrder, Boolean active, List<MatchResultHolder> teamMatchResultHolder) {
}
