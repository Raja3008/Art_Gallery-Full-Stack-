#include <stdio.h>
#include <stdlib.h>
#include <string.h>
#include <unistd.h>
#include <arpa/inet.h>

#define PORT 8080
#define BUFFER_SIZE 1024

int main() {
    int sock = 0;
    struct sockaddr_in serv_addr;
    char buffer[BUFFER_SIZE] = {0};
    char message[BUFFER_SIZE];

    // Create socket
    if ((sock = socket(AF_INET, SOCK_STREAM, 0)) < 0) {
        perror("Socket creation error");
        exit(EXIT_FAILURE);
    }

    serv_addr.sin_family = AF_INET;
    serv_addr.sin_port = htons(PORT);

    // Convert IPv4/IPv6 addresses from text to binary
    if (inet_pton(AF_INET, "127.0.0.1", &serv_addr.sin_addr) <= 0) {
        perror("Invalid address / Address not supported");
        exit(EXIT_FAILURE);
    }

    // Connect to server
    if (connect(sock, (struct sockaddr *)&serv_addr, sizeof(serv_addr)) < 0) {
        perror("Connection failed");
        exit(EXIT_FAILURE);
    }

    printf("Connected to TCP Echo Server at 127.0.0.1:%d\n", PORT);

    while (1) {
        printf("Enter message (type 'exit' to quit): ");
        fgets(message, BUFFER_SIZE, stdin);

        // Exit condition
        if (strncmp(message, "exit", 4) == 0) {
            printf("Closing connection.\n");
            break;
        }

        // Send message to server
        send(sock, message, strlen(message), 0);

        // Receive echo from server
        memset(buffer, 0, BUFFER_SIZE);
        int valread = read(sock, buffer, BUFFER_SIZE);
        if (valread > 0) {
            printf("Echo from server: %s\n", buffer);
        } else {
            printf("Server closed connection.\n");
            break;
        }
    }

    close(sock);
    return 0;
}
