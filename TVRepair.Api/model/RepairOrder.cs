using System;
using System.Collections.Generic;
using System.Data.Common;
using System.Linq;
using System.Threading.Tasks;

namespace TVRepair.Api.model
{
    public class RepairOrder
    {
        public Guid Id {get;set;}

        public string? UserName {get;set;}

        public string Brand {get;set;}

        public string Area { get;set;}

        public string IssueDescription { get; set;}

        public string? Status { get ;set ;}

        public string? TechnicianId { get ;set ;}

        public DateTime CreatedDate { get ;set ;}

        public string CustomerId { get ;set;}

        public string? PaymentStatus { get; set;}

        public DateTime? PaymentDate { get ;set;}

        public long? PaymentAmount { get ;set;}
        
    }
}