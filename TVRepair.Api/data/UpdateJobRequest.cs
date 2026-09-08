using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace TVRepair.Api.data
{
    public class UpdateJobRequest
    {

        public Guid RepairOrderId { get ;set ;}
        public string RepairNotes { get ;set;}
        public string Status { get ;set;}
    }
}