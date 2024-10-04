

using Infrastructure.Configurations;
using Microsoft.Extensions.Options;
using MailKit.Net.Smtp;
using MimeKit;
using Microsoft.AspNetCore.Hosting;
using Application.Common.Interfaces;

namespace Infrastructure.Services
{
    public class EmailService : IEmailService
    {
        private readonly EmailConfiguration _emailConfiguration;
        private readonly ClientAppConfiguarion _clientAppConfiguration;
        private readonly IWebHostEnvironment _webHostEnvironment;

        public EmailService(IOptions<EmailConfiguration> options, IOptions<ClientAppConfiguarion> clientAppOptions ,IWebHostEnvironment webHostEnvironment)
        {
            _emailConfiguration = options.Value;
            _clientAppConfiguration = clientAppOptions.Value;
            _webHostEnvironment = webHostEnvironment;
        }

        public async Task SendRecoveryToken(string receiverEmail, string receiverName, string token)
        {
            var builder = new UriBuilder(_clientAppConfiguration.BaseUrl)
            {
                Path = _clientAppConfiguration.ResetPasswordEndpoint,
                Query = $"token={Uri.EscapeDataString(token)}&email={receiverEmail}"
            };
            var filePath = Path.Combine(_webHostEnvironment.WebRootPath, "templates","reset-password.html");
            string htmlBody;
            using (var reader = new StreamReader(filePath))
            {
                htmlBody = await reader.ReadToEndAsync();
            }
            htmlBody = htmlBody.Replace("{{link}}", builder.ToString());


            var message = new MimeMessage();
            message.From.Add(MailboxAddress.Parse(_emailConfiguration.Address));
            message.To.Add(MailboxAddress.Parse(receiverEmail));
            message.Subject = receiverName;

            message.Body = new BodyBuilder
            {
                HtmlBody = htmlBody
            }.ToMessageBody();

            using var smtpClient = new SmtpClient();
            await smtpClient.ConnectAsync(_emailConfiguration.SmtpServer,_emailConfiguration.SmtpPort);
            await smtpClient.AuthenticateAsync(_emailConfiguration.Address,_emailConfiguration.Password);
            await smtpClient.SendAsync(message);
            await smtpClient.DisconnectAsync(true);
        }

        public async Task SendTwoFactorToken(string receiverEmail, string receiverName, string token)
        {
            var filePath = Path.Combine(_webHostEnvironment.WebRootPath, "templates","two-factor.html");
            string htmlBody;
            using (var reader = new StreamReader(filePath))
            {
                htmlBody = await reader.ReadToEndAsync();
            }
            htmlBody = htmlBody.Replace("{{token}}", token);


            var message = new MimeMessage();
            message.From.Add(MailboxAddress.Parse(_emailConfiguration.Address));
            message.To.Add(MailboxAddress.Parse(receiverEmail));
            message.Subject = receiverName;

            message.Body = new BodyBuilder
            {
                HtmlBody = htmlBody
            }.ToMessageBody();

            using var smtpClient = new SmtpClient();
            await smtpClient.ConnectAsync(_emailConfiguration.SmtpServer,_emailConfiguration.SmtpPort);
            await smtpClient.AuthenticateAsync(_emailConfiguration.Address,_emailConfiguration.Password);
            await smtpClient.SendAsync(message);
            await smtpClient.DisconnectAsync(true);
        }
    }
}