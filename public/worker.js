export default {
  async fetch(request, env) {
    // Standard CORS Headers so HTML client can connect safely
    const corsHeaders = {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type, Authorization",
    };
    
    // Respond to preflight OPTIONS requests immediately
    if (request.method === "OPTIONS") {
      return new Response(null, { status: 204, headers: corsHeaders });
    }
    
    const url = new URL(request.url);
    
    // Endpoint: Health Check
    if (request.method === "GET" && url.pathname === "/api/health") {
      return new Response(JSON.stringify({ status: "online", app: "Asni Guest House D1 API" }), {
        status: 200,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }
    
    // Endpoint: Execute SQL queries against D1
    if (request.method === "POST" && (url.pathname === "/api/query" || url.pathname === "/")) {
      try {
        const body = await request.json();
        const { sql, params = [] } = body;
        
        if (!sql || typeof sql !== "string") {
          return new Response(JSON.stringify({ error: "Invalid or missing 'sql' query parameter." }), {
            status: 400,
            headers: { ...corsHeaders, "Content-Type": "application/json" },
          });
        }
        
        // Check if DB binding exists
        if (!env.DB) {
          return new Response(JSON.stringify({ error: "Cloudflare D1 binding 'DB' is missing in environment." }), {
            status: 500,
            headers: { ...corsHeaders, "Content-Type": "application/json" },
          });
        }
        
        // Prepare query and bind parameters safely
        const stmt = env.DB.prepare(sql);
        const boundStmt = params.length > 0 ? stmt.bind(...params) : stmt;
        
        const isSelect = sql.trim().toUpperCase().startsWith("SELECT") || sql.trim().toUpperCase().startsWith("PRAGMA");
        
        let executionResult;
        if (isSelect) {
          executionResult = await boundStmt.all();
        } else {
          executionResult = await boundStmt.run();
        }
        
        return new Response(JSON.stringify({
          success: true,
          results: executionResult.results || [],
          meta: executionResult.meta || {},
        }), {
          status: 200,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
        
      } catch (err) {
        return new Response(JSON.stringify({
          success: false,
          error: err.message || "Failed to execute database query."
        }), {
          status: 500,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
    }
    
    // 404 Fallback
    return new Response(JSON.stringify({ error: "Endpoint not found" }), {
      status: 404,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
};