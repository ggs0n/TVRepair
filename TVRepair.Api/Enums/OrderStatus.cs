using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace TVRepair.Api.Enums
{
        public enum AcceptOrderStatus
        {
            Success,
            NotFound,
            AlreadyAccepted,
            
        }

        public static class RepairOrderStatus
        {
            public const string OrderPlace = "OrderPlace";
            public const string Accepted = "Accepted";
            public const string Quotation = "Quotation";
            public const string InProgress = "InProgress";
            public const string Complete = "Complete";
            public const string Declined = "Declined";
        }
}