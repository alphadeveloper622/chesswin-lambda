import * as mysqlL from "mysql";
import { Exception } from "./Exception";
import { CONSTANTS } from "../_helpers";
import { CHECK_PLAYING_STATUS } from "./Queries";

const mysql = mysqlL;

let connection;

export const handler = async (event: any = {}): Promise<any> => {
  if (!event || !event.userId) {
    return {
      success: false,
      error: "No userId provided"
    };
  }

  const userId = event.userId;

  console.log("User Id to check for playing status", userId);

  try {
    if (!connection) {
      initializeConnection();
    }

    await checkPlayingStatus(userId);

    return {
      success: true
    };
  } catch (e) {
    console.log("check-playing-status", e);
    return {
      success: false,
      error: Exception.ERROR
    };
  }
};

const initializeConnection = () => {
  connection = mysql.createConnection({
    host: CONSTANTS.CHESSF_MYSQL_HOST,
    user: CONSTANTS.CHESSF_MYSQL_USER,
    password: CONSTANTS.CHESSF_MYSQL_PASSWORD,
    database: CONSTANTS.CHESSF_MYSQL_DATABASE
  });
};

const checkPlayingStatus = (userId: string) => {
  return new Promise((resolve, eject) => {
    connection.query(CHECK_PLAYING_STATUS, [userId], function(error, results) {
      if (error) {
        eject(error);
      } else {
        resolve(results);
      }
    });
  });
};
