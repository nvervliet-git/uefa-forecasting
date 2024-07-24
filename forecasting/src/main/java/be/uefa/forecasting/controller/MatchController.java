package be.uefa.forecasting.controller;

import be.uefa.forecasting.dto.GroupDto;
import be.uefa.forecasting.dto.GroupMatchResultHolder;
import be.uefa.forecasting.service.MatchService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.security.Principal;
import java.util.List;

@RestController
@RequestMapping("/match")
public class MatchController {

    Logger logger = LoggerFactory.getLogger(MatchController.class);


    @Autowired
    private MatchService matchService;

    @GetMapping("/group/{year}")
    public List<GroupDto> getGroupMatches(@PathVariable final Integer year) {
        logger.info("Fetching group matches for tournament year: [{}]", year);
        return matchService.getGroupMatches(year);
    }

    @PostMapping("/group/{year}/register")
    public ResponseEntity<Void> registerMatches(Principal principal,
                                                @PathVariable final Integer year,
                                                @RequestBody final List<GroupMatchResultHolder> groupMatchResultHolder) {
        logger.trace("Submitting group matches for tournament year: [{}] & user: [{}].", year, principal.getName());
        matchService.registerResults(principal.getName(), year, groupMatchResultHolder);
        return ResponseEntity.ok().build();
    }

}
