package com.lepszasrednia.bugtracker.controller;

import com.lepszasrednia.bugtracker.entity.BugReportComment;
import com.lepszasrednia.bugtracker.entity.BugReportLog;
import com.lepszasrednia.bugtracker.repository.BugReportCommentRepository;
import com.lepszasrednia.bugtracker.repository.BugReportLogRepository;
import com.lepszasrednia.bugtracker.repository.BugReportRepository;
import com.lepszasrednia.bugtracker.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/logs")
@CrossOrigin(origins = "http://localhost:4200")
public class BugReportLogController {
    private final BugReportLogRepository bugReportLogRepository;

    @Autowired
    public BugReportLogController(BugReportLogRepository bugReportLogRepository, BugReportRepository bugReportRepository) {
        this.bugReportLogRepository = bugReportLogRepository;

    }

    @GetMapping("/{bug_report_id}")
    public ResponseEntity<List<BugReportLog>> getBugReportComment(@PathVariable Integer bug_report_id) {
        List<BugReportLog> logs = bugReportLogRepository.findBugReportLogsByBugReport_Id(bug_report_id);
        return ResponseEntity.ok(logs);
    }
}
