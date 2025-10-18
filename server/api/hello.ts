import { usersTable } from "../db/schema/user";

export default defineEventHandler(async (event) => {
  try {
    const { db } = event.context;
    const user = await db
      .select({
        id: usersTable.UserId,
        name: usersTable.UserName,
        email: usersTable.UserEmail,
        createdAt: usersTable.CreatedAt,
      })
      .from(usersTable)
      .all();
    // 这里我如果不加上这个设置响应头就会报错，虽然数据成功返回，
    setResponseHeaders(event, {
      Connection: "close",
      "Content-Type": "application/json",
    });
    return user;
  } catch (error) {
    console.error("数据库查询错误:", error);
    throw createError({
      statusCode: 500,
      statusMessage: "服务器内部错误",
      message: "获取用户数据时发生错误",
    });
  }
});
