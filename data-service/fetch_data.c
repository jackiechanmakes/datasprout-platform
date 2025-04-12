#include <wiringPi.h>
#include <stdio.h>
#include <stdlib.h>
#include <stdint.h>
#include <wiringPiI2C.h>
#include <string.h>
#include <time.h>

#include <mysql/mysql.h>
#include <stdio.h>

#define MAXTIMINGS 85
#define DHTPIN 7

void insert_db();
void fetch_data(char *startDate, char *endDate);

// LCD information
int LCDAddr = 0x27;
int BLEN = 1;
int fd;

void write_word(int data){
	int temp = data;
	if ( BLEN == 1 )
		temp |= 0x08;
	else
		temp &= 0xF7;
	wiringPiI2CWrite(fd, temp);
}

void send_command(int comm){
	int buf;
	// Send bit7-4 firstly
	buf = comm & 0xF0;
	buf |= 0x04;			// RS = 0, RW = 0, EN = 1
	write_word(buf);
	delay(2);
	buf &= 0xFB;			// Make EN = 0
	write_word(buf);

	// Send bit3-0 secondly
	buf = (comm & 0x0F) << 4;
	buf |= 0x04;			// RS = 0, RW = 0, EN = 1
	write_word(buf);
	delay(2);
	buf &= 0xFB;			// Make EN = 0
	write_word(buf);
}

void send_data(int data){
	int buf;
	// Send bit7-4 firstly
	buf = data & 0xF0;
	buf |= 0x05;			// RS = 1, RW = 0, EN = 1
	write_word(buf);
	delay(2);
	buf &= 0xFB;			// Make EN = 0
	write_word(buf);

	// Send bit3-0 secondly
	buf = (data & 0x0F) << 4;
	buf |= 0x05;			// RS = 1, RW = 0, EN = 1
	write_word(buf);
	delay(2);
	buf &= 0xFB;			// Make EN = 0
	write_word(buf);
}

void init(){
	send_command(0x33);	// Must initialize to 8-line mode at first
	delay(5);
	send_command(0x32);	// Then initialize to 4-line mode
	delay(5);
	send_command(0x28);	// 2 Lines & 5*7 dots
	delay(5);
	send_command(0x0C);	// Enable display without cursor
	delay(5);
	send_command(0x01);	// Clear Screen
	wiringPiI2CWrite(fd, 0x08);
}

void clear(){
	send_command(0x01);	//clear Screen
}

void write(int x, int y, char data[]){
	int addr, i;
	int tmp;
	if (x < 0)  x = 0;
	if (x > 15) x = 15;
	if (y < 0)  y = 0;
	if (y > 1)  y = 1;

	// Move cursor
	addr = 0x80 + 0x40 * y + x;
	send_command(addr);

	tmp = strlen(data);
	for (i = 0; i < tmp; i++){
		send_data(data[i]);
	}
}

void writeLCD(char* data){
	fd = wiringPiI2CSetup(LCDAddr);
	init();
    write(0, 0, " humi temp time");
    write(1, 1, data);
	// clear();
}

// Humdifier 
int dht11_dat[5] = { 0, 0, 0, 0, 0 };

void read_dht11_dat(char *startDate, char *endDate)
{
    uint8_t laststate = HIGH;
    uint8_t counter = 0;
    uint8_t j = 0, i;
    float f;
    dht11_dat[0] = dht11_dat[1] = dht11_dat[2] = dht11_dat[3] = dht11_dat[4] = 0;
    pinMode( DHTPIN, OUTPUT );
    digitalWrite( DHTPIN, LOW );
    delay( 18 );
    digitalWrite( DHTPIN, HIGH );
    delayMicroseconds( 40 );
    pinMode( DHTPIN, INPUT );
    for ( i = 0; i < MAXTIMINGS; i++ )
    {
        counter = 0;
        while ( digitalRead( DHTPIN ) == laststate )
        {
            counter++;
            delayMicroseconds( 1 );
            if ( counter == 255 )
            {
                break;
            }
        }
        laststate = digitalRead( DHTPIN );
        if ( counter == 255 )
            break;
        if ( (i >= 4) && (i % 2 == 0) )
        {
            dht11_dat[j / 8] <<= 1;
            if ( counter > 16 )
                dht11_dat[j / 8] |= 1;
            j++;
        }
    }
    if ( (j >= 40) &&
            (dht11_dat[4] == ( (dht11_dat[0] + dht11_dat[1] + dht11_dat[2] + dht11_dat[3]) & 0xFF) ) )
    {   
        // Format data for LCD
        char lcd_data[16] = "";
        char humidifier_data[5];
        char temperature_data[5];
        char time_data[6];

        // Humidifier and Temp data
        sprintf(humidifier_data, "%d.%d",  dht11_dat[0], dht11_dat[1]);
        sprintf(temperature_data, "%d.%d",  dht11_dat[2], dht11_dat[3]);
        strcat(lcd_data, humidifier_data);
        strcat(lcd_data, " ");
        strcat(lcd_data, temperature_data);
        strcat(lcd_data, " ");

        // Time data
        time_t current_time;
        struct tm * time_info;
        time(&current_time);
        time_info = localtime(&current_time);
        strftime(time_data, 6, "%H:%M", time_info);
        strcat(lcd_data, time_data);

        writeLCD(lcd_data);

        insert_db();
        // Print to console
        // printf( "Humidity = %d.%d %% Temperature = %d.%d C (%.1f F) Time = %s\n",
        //         dht11_dat[0], dht11_dat[1], dht11_dat[2], dht11_dat[3], f, time_data);
    }
    else
    {
        printf( "Data not good, skip\n" );
    }

    fetch_data(startDate, endDate);

}

MYSQL *conn;
MYSQL_RES *res;
MYSQL_ROW row;

void connect_db() {
    char *server = "localhost";
    char *user = "john";
    char *password = "password";
    char *database = "studentdb";

    conn = mysql_init(NULL);
    /* Connect to database */
    if (!mysql_real_connect(conn, server, user, password, database, 0, NULL, 0))
    {
        fprintf(stderr, "%s\n", mysql_error(conn));
        exit(1);
    }
}

void disconnect_db() {
    /* Close connection */
    mysql_free_result(res);
    mysql_close(conn);
}

void insert_db() {
    char sqlInsertStatement[100];
    sprintf(sqlInsertStatement, "INSERT INTO sensor_data (humidity, temperature, timestamp) VALUES (%d.%d, %d.%d, NOW())", dht11_dat[0], dht11_dat[1], dht11_dat[2], dht11_dat[3]);

    /* Send SQL insert query */
    if ( mysql_query(conn, sqlInsertStatement))
    {
        fprintf(stderr, "%s\n", mysql_error(conn));
        exit(1);
    }
    res = mysql_use_result(conn);
}

void fetch_data(char* startDate, char *endDate) {
    /* Send SQL select query */

    char queryStr[150] = "select temperature, humidity, timestamp from sensor_data WHERE `timestamp` BETWEEN '";
    strcat(queryStr, startDate);
    strcat(queryStr, " 00:00' AND '");
    strcat(queryStr, endDate);
    strcat(queryStr, " 23:59' ORDER BY timestamp");

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
    if ( wiringPiSetup() == -1 )
        exit( 1 );
    connect_db();
    read_dht11_dat(startDate, endDate);
    disconnect_db();
    return(0);
}


