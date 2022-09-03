import com.github.gradle.node.npm.task.NpmTask
import com.palantir.gradle.docker.DockerExtension
import org.jetbrains.kotlin.gradle.tasks.KotlinCompile

plugins {
    id("org.springframework.boot") version "2.6.4"
    id("io.spring.dependency-management") version "1.0.11.RELEASE"
    id("com.github.node-gradle.node") version "3.4.0"
    kotlin("jvm") version "1.6.10"
    kotlin("plugin.spring") version "1.6.10"
    kotlin("plugin.jpa") version "1.6.10"
    id("com.palantir.docker") version "0.22.1"
    id("com.palantir.docker-run") version "0.22.1"
}

group = "com.antonl.cssundays"
version = "0.0.1"
java.sourceCompatibility = JavaVersion.VERSION_17

repositories {
    mavenCentral()
}

springBoot {
    mainClass.set("com.antonl.cssundays.CssundaysApplicationKt")
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

tasks.register<JavaExec>("generateGraphQLSchema") {
    classpath = sourceSets.main.get().runtimeClasspath
    mainClass.set("com.antonl.cssundays.graphql.server.SchemaGenerator")
    inputs.dir("src/main/kotlin/com/antonl/cssundays/graphql/server")
    outputs.file("schema.graphql")
    outputs.upToDateWhen { false }
}

tasks.register("devBuild") {
    dependsOn(":build")
    dependsOn(":compileKotlin")
    dependsOn("npmInstall")
    dependsOn("GenerateGraphQLSchema")
}

//tasks.register("dockerFrontend") {
//    docker {
//        name = "${project.name}-frontend:${project.version}"
//        setDockerfile(File("image-frontend.dockerfile"))
//    }
//}
//
//tasks.register("dockerBackend") {
//    docker {
//        name = "${project.name}-backend:${project.version}"
//        setDockerfile(File("image-backend.dockerfile"))
//        files(File("build/libs/cssundays-0.0.1.jar"))
//    }
//}
//
//tasks.register("dockerBuild") {
//    dependsOn("dockerFrontend")
//    dependsOn("dockerBackend")
//}
//
//tasks.register("dockerRunBackend") {
//    dockerRun {
//        name = "${project.name}-backend"
//        image = " ${project.name}-backend:${project.version}"
//        this.ports("8080:8090")
//        clean = true
//    }
//}
//
//tasks.register("dockerRunFrontend") {
//    dockerRun {
//        name = "${project.name}-frontend"
//        image = " ${project.name}-frontend:${project.version}"
//        this.ports("3000:80")
//        clean = true
//    }
//}
//
//tasks.register("dockerRunStack") {
//    dependsOn(":dockerRunFrontend")
//    dependsOn(":dockerRunBackend")
//}
