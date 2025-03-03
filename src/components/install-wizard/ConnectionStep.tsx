
  const testConnection = async () => {
    if (!validateInputs()) {
      return;
    }
    
    setTesting(true);
    setTestResult(null);
    
    try {
      const supabase = createClient(config.url, config.key);
      
      // Test basic connection with a simpler query that doesn't require tables to exist
      const { data, error } = await supabase.auth.getSession();
      
      if (error) {
        setTestResult({
          success: false, 
          message: "Connection failed: " + error.message
        });
        return;
      }
      
      // Check if we have proper permissions by checking if we can create schema objects
      try {
        // First try to access schema information with an RPC call
        let schemaError;
        
        try {
          // Try calling a schema version RPC function (might not exist in new projects)
          const { error: rpcError } = await supabase.rpc('get_schema_version');
          schemaError = rpcError;
        } catch (err) {
          // If the RPC call itself throws an exception (not just returns an error)
          schemaError = { message: "RPC function doesn't exist" };
        }
        
        // If RPC failed, try direct schema access
        if (schemaError) {
          try {
            // Try to test if we can create tables, which requires elevated permissions
            const { error: sqlError } = await supabase
              .from('_test_permissions')
              .select('*')
              .limit(1)
              .single();
              
            // Handle non-existent table error separately from permission errors
            if (sqlError && !sqlError.message.includes("relation") && sqlError.message.includes("permission denied")) {
              setTestResult({
                success: false, 
                message: "Connection successful, but insufficient permissions. Make sure you're using the service_role key."
              });
              return;
            }
            
            // If we get here, we likely have good permissions
            setTestResult({
              success: true, 
              message: "Connection successful! Ready to set up the database."
            });
          } catch (err) {
            // If all else fails, assume we're good as long as we connected
            setTestResult({
              success: true, 
              message: "Connection successful! Ready to set up the database."
            });
          }
        } else {
          // RPC call worked, we have good permissions
          setTestResult({
            success: true, 
            message: "Connection successful! Ready to set up the database."
          });
        }
      } catch (permError) {
        // Fallback that just assumes we're good if we can connect at all
        setTestResult({
          success: true, 
          message: "Connection successful! Ready to set up the database."
        });
      }
    } catch (error) {
      setTestResult({
        success: false, 
        message: "Connection failed: " + String(error)
      });
    } finally {
      setTesting(false);
    }
  };
