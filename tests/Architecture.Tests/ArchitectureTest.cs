using System.Reflection;
using FluentAssertions;
using NetArchTest.Rules;

namespace Architecture.Tests;

public class ArchitectureTest
{
    private const string DomainNamespace = "Domain";
    private const string ApplicationNamespace = "Application";
    private const string InfrastructureNamespace = "Infrastructure";
    private const string WebApiNamespace = "WebApi";

    [SetUp]
    public void Setup()
    {
    }

    [Test]
    public void Domain_Should_Not_HaveAnyDependency()
    {
        //Arrange
        var assembly = Assembly.LoadFrom("Domain.dll");
        //Act
        var testResult = Types.InAssembly(assembly).ShouldNot()
        .HaveDependencyOnAny(ApplicationNamespace, InfrastructureNamespace, WebApiNamespace)
        .GetResult();
        //Assert
        testResult.IsSuccessful.Should().BeTrue();
    }

    [Test]
    public void Application_Should_Not_HaveDependencyOnInfrastructureAndWebApi(){
        //Arrange
        var assembly = Assembly.LoadFrom("Application.dll");
        //Act
        var testResult = Types.InAssembly(assembly).ShouldNot()
        .HaveDependencyOnAll(InfrastructureNamespace,WebApiNamespace).GetResult();
        //Assert
        testResult.IsSuccessful.Should().BeTrue();
    }

    [Test]
    public void Infrastructure_Should_Not_HaveDependencyOnWebApi(){
        //Arrange
        var assembly = Assembly.LoadFrom("Infrastructure.dll");
        //Act
        var testResult = Types.InAssembly(assembly).ShouldNot()
        .HaveDependencyOn(WebApiNamespace).GetResult();
        //Assert
        testResult.IsSuccessful.Should().BeTrue();
    }

}