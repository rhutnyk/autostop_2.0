using System;
using System.Collections.Generic;
using System.Data;
using System.Data.SqlClient;


namespace AutoStop.Models
{
    public static class ANet
    {
        readonly static string connectionString = @"Data Source=mssql2.wh.hosting.ua;Initial Catalog=rhutnyk_autostop2;User ID=rhutnyk_autostop;Password=3195223890";


        public static string InsertPartToDb (List<Part> list)
        {
            try
            {
                var dataTable = PartConvertToDataTable(list);
                var dropResult = DropTable("TempPart");
                var insertResult = InsertTable(dataTable, "TempPart");
                var mergeResult = CallProcedure("CopyPart");
                var dropAfterMerge = DropTable("TempPart");

                return CreateMessage("part", dropAfterMerge, insertResult, mergeResult);
            }
            catch (Exception ex)
            {
                return ex.Message;
            }
        }


        public static string InsertAnalogToDb(List<Analog> list)
        {
            try
            {
                var dataTable = AnalogConvertToDataTable(list);
                var dropResult = DropTable("TempAnalog");
                var insertResult = InsertTable(dataTable, "TempAnalog");
                var mergeResult = CallProcedure("CopyAnalog");
                var dropAfterMerge = DropTable("TempAnalog");

                return CreateMessage("analog", dropAfterMerge, insertResult, mergeResult);
            }
            catch (Exception ex)
            {
                return ex.Message;
            }
        }


        private static int InsertTable(DataTable data, string tableName)
        {
            try
            {
                using (var sqlBulk = new SqlBulkCopy(connectionString))
                {
                    sqlBulk.BatchSize = 5000;
                    sqlBulk.DestinationTableName = tableName;
                    sqlBulk.WriteToServer(data);
                }
            }catch(Exception ex) { throw ex; }

            return data.Rows.Count;
        }



        private static int DropTable(string tableName)
        {
            int count;
            try
            {
                using (SqlConnection connection = new SqlConnection(connectionString))
                {
                    connection.Open();
                    string sqlExpression = string.Format("delete from " + tableName);
                    var command = new SqlCommand(sqlExpression, connection);
                    count = command.ExecuteNonQuery();
                }
            }catch(Exception ex) { throw ex; }

            return count;
        }

        

        private static int CallProcedure(string procName)
        {
            int count;
            try
            {
                using (SqlConnection connection = new SqlConnection(connectionString))
                {
                    var command = new SqlCommand(procName, connection);
                    command.CommandType = CommandType.StoredProcedure;
                    connection.Open();
                    count = command.ExecuteNonQuery();
                }
            }catch(Exception ex) { throw ex; }

            return count;
        }



        private static DataTable PartConvertToDataTable(List<Part> parts)
        {
            DataTable dt;
            try
            {
                dt = new DataTable();
                dt.Columns.Add("id");
                dt.Columns.Add("Number");
                dt.Columns.Add("Description");
                dt.Columns.Add("Qty");
                dt.Columns.Add("Price");
                dt.Columns.Add("Brand");
                dt.Columns.Add("NumberSearch");
                dt.Columns.Add("hasAnalog");

                foreach (var item in parts)
                {
                    dt.Rows.Add(item.id, item.Number, item.Description, item.Qty, item.Price, item.Brand, item.NumberSearch, item.hasAnalog);
                }
            }
            catch (Exception ex) { throw ex; }

            return dt;
        }



        private static DataTable AnalogConvertToDataTable(List<Analog> analogs)
        {
            DataTable dt;
            try
            {
                dt = new DataTable();
                dt.Columns.Add("partId");
                dt.Columns.Add("analogId");

                foreach (var item in analogs)
                {
                    dt.Rows.Add(item.partId, item.analogId);
                }
            }
            catch (Exception ex) { throw ex; }

            return dt;
        }



        private static string CreateMessage(string tableName, int dropCount, int insertCount, int mergeCount)
        {
            return "OK " + tableName.ToUpper() + "_TABLE  DEL:" + dropCount + " INS:" + insertCount + " MER:" + mergeCount + "\\ ";
        }


    }
}