// SPDX-License-Identifier: MIT
pragma solidity ^0.8.16;

contract RentalContract {
    address public owner;
    address public tenant;
    uint public rentAmount;
    uint public startDate;
    uint public endDate;
    bool public tenantOnPenaltyList;
    bool public ownerOnPenaltyList;
    uint public earlyTerminationPeriod;  // 15 gün

    enum ContractState { Created, Active, Inactive }
    ContractState public state;

    enum ComplaintStatus { Pending, Approved, Rejected }
    
    struct Complaint {
        address complainant;
        string description;
        ComplaintStatus status;
    }
    
    Complaint[] public complaints;
    
    event ContractCreated(address indexed owner, address indexed tenant, uint rentAmount, uint startDate, uint endDate);
    event ContractActivated();
    event ContractDeactivated();
    event ComplaintFiled(address indexed complainant, string description);
    event ComplaintResolved(address indexed complainant, ComplaintStatus status);
    event TerminationRequested(address indexed requester);
    event TerminationApproved(address indexed requester);
    
    modifier onlyOwner() {
        require(msg.sender == owner, "Only the owner can call this function");
        _;
    }

    modifier onlyTenant() {
        require(msg.sender == tenant, "Only the tenant can call this function");
        _;
    }

    constructor() {
        owner = msg.sender;
        state = ContractState.Created;
        earlyTerminationPeriod = 15 days;
    }

    function createContract(address _tenant, uint _rentAmount, uint _startDate, uint _endDate) public onlyOwner {
        tenant = _tenant;
        rentAmount = _rentAmount;
        startDate = _startDate;
        endDate = _endDate;
        state = ContractState.Active;
        emit ContractCreated(owner, tenant, rentAmount, startDate, endDate);
    }

    function deactivateContract() public onlyOwner {
        state = ContractState.Inactive;
        emit ContractDeactivated();
    }

    function fileComplaint(string memory _description) public {
        require(state == ContractState.Active, "Contract is not active");
        complaints.push(Complaint(msg.sender, _description, ComplaintStatus.Pending));
        emit ComplaintFiled(msg.sender, _description);
    }

    function resolveComplaint(uint _complaintIndex, ComplaintStatus _status) public onlyOwner {
        require(_complaintIndex < complaints.length, "Invalid complaint index");
        require(complaints[_complaintIndex].status == ComplaintStatus.Pending, "Complaint is not pending");
        complaints[_complaintIndex].status = _status;

        if (_status == ComplaintStatus.Approved) {
            if (complaints[_complaintIndex].complainant == tenant) {
                tenantOnPenaltyList = true;
            } else if (complaints[_complaintIndex].complainant == owner) {
                ownerOnPenaltyList = true;
            }
        }

        emit ComplaintResolved(complaints[_complaintIndex].complainant, _status);
    }

    function requestTermination() public onlyTenant {
        require(state == ContractState.Active, "Contract is not active");
        require(block.timestamp < endDate - earlyTerminationPeriod, "Cannot request early termination now");
        emit TerminationRequested(msg.sender);
    }

    function approveTermination() public onlyOwner {
        require(state == ContractState.Active, "Contract is not active");
        require(tenantOnPenaltyList == false, "Tenant is on penalty list");
        require(block.timestamp < endDate - earlyTerminationPeriod, "Cannot approve early termination now");
        state = ContractState.Inactive;
        emit TerminationApproved(tenant);

    
    }

    
}
