

namespace Application.Common.Interfaces
{
    public interface IEmailService
    {
        Task SendRecoveryToken(string receiverEmail, string receiverName ,string token);
        Task SendTwoFactorToken(string receiverEmail, string receiverName, string token);
    }
}