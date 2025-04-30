/*********************************************************
 * File name: fetch_data.c
 * Description: This program fetches temperature and humidity data stored in a 
 *              MariaDB database between a given start date and end date.  
**********************************************************/

#include <stdio.h>
#include <stdlib.h>
#include <stdint.h>
#include <string.h>
#include <time.h>
#include <mysql/mysql.h>

MYSQL *conn;
MYSQL_RES *res;
MYSQL_ROW row;

void connect_db() {
    char *server = "localhost";
    char *user = "john";
    char *password = "password";
    char *database = "studentdb";

    conn = mysql_init(NULL);
    // Connect to database
    if (!mysql_real_connect(conn, server, user, password, database, 0, NULL, 0))
    {
        fprintf(stderr, "%s\n", mysql_error(conn));
        exit(1);
    }
}

void disconnect_db() {
    // Close connection 
    mysql_free_result(res);
    mysql_close(conn);
}

void fetch_data(char* startDate, char *endDate) {
    // Send SQL select query
    char queryStr[200] = "select temperature, humidity, timestamp from sensor_data WHERE `timestamp` BETWEEN '";
    strcat(queryStr, startDate);
    strcat(queryStr, " 00:00:00' AND '");
    strcat(queryStr, endDate);
    strcat(queryStr, " 23:59:59' ORDER BY timestamp");

    if (mysql_query(conn, queryStr))    
    {
        fprintf(stderr, "%s\n", mysql_error(conn));
        exit(1);
    }

    res = mysql_store_result(conn);
    row = mysql_fetch_row(res);

    if (res) {
        while ((row = mysql_fetch_row(res)) != NULL) {
            printf("Temperature: %s\n", row[0]);
            printf("Humidity: %s\n", row[1]);
            printf("Timestamp: %s\n", row[2]);
        }
    } else {
        fprintf(stderr, "No results found.\n");
        exit(1);
    }
}

int main( int argc, char *argv[] )
{
    char *startDate = argv[1];
    char *endDate = argv[2];

    connect_db();
    fetch_data(startDate, endDate);
    disconnect_db();
    return(0);
}


