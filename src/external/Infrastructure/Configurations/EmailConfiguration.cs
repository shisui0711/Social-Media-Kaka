

namespace Infrastructure.Configurations
{
    public class EmailConfiguration
    {
        public string SmtpServer { get; set; } = null!;
        public int SmtpPort { get; set; }
        public string Address { get; set; } = null!;
        public string Password { get; set; } = null!;
    }
}