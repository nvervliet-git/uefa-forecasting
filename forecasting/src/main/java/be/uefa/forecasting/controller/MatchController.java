package be.uefa.forecasting.controller;

import be.uefa.forecasting.dto.GroupDto;
import be.uefa.forecasting.service.MatchService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/match")
public class MatchController {

    @Autowired
    private MatchService matchService;

    @GetMapping("/group/{year}")
    public List<GroupDto> getGroupMatches(@PathVariable final Integer year) {
        return matchService.getGroupMatches(year);
    }

}
