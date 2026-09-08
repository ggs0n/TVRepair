using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Threading.Tasks;

namespace TVRepair.Api.data
{
    public class AddRepairOrderRequest
    {
        [Required]
        [StringLength(50)]
        public string Brand { get; set; } = "";

        [Required]
        [StringLength(100)]
        public string Area { get; set; } = "";

        [Required]
        [StringLength(1000)]
        public string IssueDescription { get; set; } = "";

        public IFormFile? Photo { get; set; }

        public string CustomerId { get ; set;}
    }
}