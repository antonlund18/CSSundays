import org.jetbrains.kotlin.gradle.tasks.KotlinCompile

plugins {
    id("org.springframework.boot") version "2.6.4"
    id("io.spring.dependency-management") version "1.0.11.RELEASE"
    kotlin("jvm") version "1.6.10"
    kotlin("plugin.spring") version "1.6.10"
    kotlin("plugin.jpa") version "1.6.10"
}

group = "com.antonl.cssundays"
version = "0.0.1-SNAPSHOT"
java.sourceCompatibility = JavaVersion.VERSION_17

repositories {
    mavenCentral()
}

dependencies {
    // Kotlin
    implementation("org.jetbrains.kotlin:kotlin-reflect")
    implementation("org.jetbrains.kotlin:kotlin-stdlib-jdk8")

    // JWT
    implementation("io.github.nefilim.kjwt:kjwt-core:0.5.3")

    // BCrypt
    implementation("com.ToxicBakery.library.bcrypt:bcrypt:1.0.9")

	// Arrow
	implementation("io.arrow-kt:arrow-core:1.1.2")

    // Spring
    implementation("org.springframework.boot:spring-boot-starter-data-jpa")

	// Amazon Web Services
	implementation("aws.sdk.kotlin:s3:0.9.4-beta")

    // GraphQL
    implementation("com.expediagroup:graphql-kotlin-spring-server:6.0.0-alpha.5")
    implementation("com.expediagroup:graphql-kotlin-schema-generator:6.0.0-alpha.5")

    // Jackson
    implementation("com.fasterxml.jackson.module:jackson-module-kotlin")

    // MSSQL
    runtimeOnly("com.microsoft.sqlserver:mssql-jdbc")
}

tasks.withType<KotlinCompile> {
    kotlinOptions {
        freeCompilerArgs = listOf("-Xjsr305=strict")
        jvmTarget = "17"
    }
}

tasks.withType<Test> {
    useJUnitPlatform()
}

tasks.register<JavaExec>("GenerateGraphQLSchema") {
    dependsOn(":compileKotlin")
    inputs.dir("src/main/kotlin/com/antonl/cssundays/graphql/server")
    outputs.file("schema.graphql")
    classpath = sourceSets.main.get().runtimeClasspath
    mainClass.set("com.antonl.cssundays.graphql.server.SchemaGenerator")
}