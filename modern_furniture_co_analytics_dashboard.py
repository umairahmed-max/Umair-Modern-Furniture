import streamlit as st
import pandas as pd
import numpy as np
import plotly.express as px
import plotly.graph_objects as go
import duckdb
import io
from datetime import datetime

# Configure Streamlit Page
st.set_page_config(
    page_title="Modern Furniture Co. - Executive Analytics Dashboard",
    page_icon="📊",
    layout="wide",
    initial_sidebar_state="expanded"
)

# Custom Styling for Professional Enterprise Look
st.markdown("""
    <style>
    .main { background-color: #f8fafc; }
    .stMetric { background-color: #ffffff; padding: 15px; border-radius: 8px; box-shadow: 0 1px 3px rgba(0,0,0,0.1); }
    .card { background-color: #ffffff; padding: 20px; border-radius: 8px; box-shadow: 0 1px 3px rgba(0,0,0,0.1); margin-bottom: 20px; }
    .stAlert { border-radius: 8px; }
    </style>
""", unsafe_allow_html=True)

@st.cache_resource
def init_duckdb():
    """Initializes an in-memory DuckDB connection for lightning-fast SQL queries."""
    return duckdb.connect(database=':memory:', read_only=False)

def process_uploaded_files(uploaded_files):
    """
    Ingests raw CSVs, standardizes column names, parses dates, handles missing values,
    and registers tables into DuckDB while logging governance transformations.
    """
    db_conn = init_duckdb()
    processed = {}
    audit_log = []
    
    file_mapping = {
        "customers_data": "customers_data",
        "design_log": "design_log",
        "financial_ledger": "financial_ledger",
        "hr_events_log": "hr_events_log",
        "hr_roster": "hr_roster",
        "inventory_log": "inventory_log",
        "orders_data": "orders_data"
    }
    
    uploaded_dict = {f.name.lower(): f for f in uploaded_files}
    
    for key, table_name in file_mapping.items():
        matched = None
        for u_name, u_file in uploaded_dict.items():
            if key in u_name:
                matched = u_file
                break
                
        if matched:
            try:
                df = pd.read_csv(matched)
                initial_rows = len(df)
                df.columns = [c.strip().lower().replace(' ', '_') for c in df.columns]
                
                # Table-specific normalization
                if table_name == "customers_data":
                    if 'customer_id' in df.columns:
                        df = df.drop_duplicates(subset=['customer_id'])
                        audit_log.append(f"customers_data: De-duplicated on customer_id, removed {initial_rows - len(df)} rows.")
                    if 'signup_date' in df.columns:
                        df['signup_date'] = pd.to_datetime(df['signup_date'], errors='coerce')
                    if 'lifetime_value' in df.columns:
                        df['lifetime_value'] = pd.to_numeric(df['lifetime_value'], errors='coerce').fillna(0.0)
                        
                elif table_name == "orders_data":
                    if 'order_id' in df.columns:
                        df = df.drop_duplicates(subset=['order_id'])
                        audit_log.append(f"orders_data: De-duplicated on order_id, removed {initial_rows - len(df)} rows.")
                    for dt in ['order_date', 'fulfillment_date', 'due_date']:
                        if dt in df.columns:
                            df[dt] = pd.to_datetime(df[dt], errors='coerce')
                    if 'status' in df.columns:
                        df['status'] = df['status'].astype(str).str.strip().str.title()
                    if 'total_amount' in df.columns:
                        df['total_amount'] = pd.to_numeric(df['total_amount'], errors='coerce').fillna(0.0)
                        
                elif table_name == "design_log":
                    if 'design_id' in df.columns:
                        df = df.drop_duplicates(subset=['design_id'])
                    for dt in ['created_date', 'completion_date']:
                        if dt in df.columns:
                            df[dt] = pd.to_datetime(df[dt], errors='coerce')
                    if 'status' in df.columns:
                        df['status'] = df['status'].astype(str).str.strip().str.title()
                    if 'estimated_cost' in df.columns:
                        df['estimated_cost'] = pd.to_numeric(df['estimated_cost'], errors='coerce').fillna(0.0)
                        
                elif table_name == "financial_ledger":
                    if 'transaction_id' in df.columns:
                        df = df.drop_duplicates(subset=['transaction_id'])
                    if 'transaction_date' in df.columns:
                        df['transaction_date'] = pd.to_datetime(df['transaction_date'], errors='coerce')
                    if 'amount' in df.columns:
                        df['amount'] = pd.to_numeric(df['amount'], errors='coerce').fillna(0.0)
                    if 'account_category' in df.columns:
                        df['account_category'] = df['account_category'].astype(str).str.strip().str.title()
                        
                elif table_name == "hr_roster":
                    if 'employee_id' in df.columns:
                        df = df.drop_duplicates(subset=['employee_id'])
                    if 'hire_date' in df.columns:
                        df['hire_date'] = pd.to_datetime(df['hire_date'], errors='coerce')
                    if 'status' in df.columns:
                        df['status'] = df['status'].astype(str).str.strip().str.title()
                        
                elif table_name == "hr_events_log":
                    if 'event_id' in df.columns:
                        df = df.drop_duplicates(subset=['event_id'])
                    if 'event_date' in df.columns:
                        df['event_date'] = pd.to_datetime(df['event_date'], errors='coerce')
                    if 'event_type' in df.columns:
                        df['event_type'] = df['event_type'].astype(str).str.strip().str.title()
                        
                elif table_name == "inventory_log":
                    df = df.drop_duplicates()
                    if 'timestamp' in df.columns:
                        df['timestamp'] = pd.to_datetime(df['timestamp'], errors='coerce')
                    if 'quantity_change' in df.columns:
                        df['quantity_change'] = pd.to_numeric(df['quantity_change'], errors='coerce').fillna(0)
                        
                db_conn.register(table_name, df)
                processed[table_name] = df
                audit_log.append(f"Successfully loaded '{table_name}' with {len(df)} records into DuckDB.")
            except Exception as e:
                audit_log.append(f"Error processing {matched.name}: {str(e)}")
                
    return db_conn, processed, audit_log

def main():
    st.title("📊 Modern Furniture Co. - Executive Analytics Dashboard")
    st.markdown("### Comprehensive Business Intelligence & Operational Performance Suite")
    
    st.sidebar.header("1. Data Ingestion")
    uploaded_files = st.sidebar.file_uploader(
        "Upload CSV files (orders_data, design_log, financial_ledger, hr_events_log, hr_roster, inventory_log, customers_data)",
        accept_multiple_files=True,
        type=['csv']
    )
    
    if not uploaded_files:
        st.warning("⚠️ Please upload your operational CSV files in the sidebar to populate the analytics dashboard.")
        st.markdown("""
        ### Dashboard Guide
        Once uploaded, this interactive suite provides:
        - **Executive Summary:** High-level KPI scorecards, order distribution pie charts, and project pipelines.
        - **Orders & Fulfillment:** Delivery performance breakdown, cycle times, and monetary distribution.
        - **Design Workloads:** Staff capacity and active project workloads across designers.
        - **Financial Ledger:** Revenue and expense tracking by account category.
        - **HR & Inventory Audits:** Headcount distributions and net inventory movements.
        """)
        return

    db_conn, processed_dfs, audit_log = process_uploaded_files(uploaded_files)
    st.sidebar.success(f"Successfully loaded {len(processed_dfs)} datasets into DuckDB!")
    
    with st.expander("🔍 View Data Ingestion & Governance Audit Log"):
        for log in audit_log:
            st.write(f"- {log}")
            
    st.markdown("---")
    
    tab1, tab2, tab3, tab4, tab5 = st.tabs([
        "📈 Executive Summary", 
        "📦 Orders & Fulfillment", 
        "🎨 Design Workloads", 
        "💰 Financial Ledger", 
        "👥 HR & Inventory"
    ])
    
    with tab1:
        st.subheader("Executive Performance Overview")
        
        total_orders = db_conn.execute("SELECT COUNT(*) FROM orders_data").fetchone()[0] if "orders_data" in processed_dfs else 0
        total_rev = db_conn.execute("SELECT SUM(total_amount) FROM orders_data").fetchone()[0] if "orders_data" in processed_dfs else 0
        total_designs = db_conn.execute("SELECT COUNT(*) FROM design_log").fetchone()[0] if "design_log" in processed_dfs else 0
        total_employees = db_conn.execute("SELECT COUNT(*) FROM hr_roster").fetchone()[0] if "hr_roster" in processed_dfs else 0
        
        col1, col2, col3, col4 = st.columns(4)
        col1.metric("Total Orders", f"{total_orders:,}")
        col2.metric("Total Order Revenue", f"${total_rev:,.2f}" if total_rev else "$0.00")
        col3.metric("Custom Design Projects", f"{total_designs:,}")
        col4.metric("Active Personnel", f"{total_employees:,}")
        
        st.markdown("---")
        
        c1, c2 = st.columns(2)
        with c1:
            if "orders_data" in processed_dfs:
                ord_df = db_conn.execute("SELECT status, COUNT(*) as count FROM orders_data GROUP BY status").fetchdf()
                fig = px.pie(ord_df, names='status', values='count', title="Order Distribution by Status", hole=0.4)
                st.plotly_chart(fig, use_container_width=True)
            else:
                st.info("orders_data dataset not available.")
                
        with c2:
            if "design_log" in processed_dfs:
                des_df = db_conn.execute("SELECT status, COUNT(*) as count FROM design_log GROUP BY status").fetchdf()
                fig = px.bar(des_df, x='status', y='count', title="Design Projects by Status", text_auto=True, color='status')
                st.plotly_chart(fig, use_container_width=True)
            else:
                st.info("design_log dataset not available.")

    with tab2:
        st.subheader("Order Fulfillment & Pipeline Analytics")
        if "orders_data" in processed_dfs:
            orders_query = """
                SELECT 
                    order_id, customer_id, order_date, fulfillment_date, due_date, total_amount, status,
                    CASE 
                        WHEN due_date IS NOT NULL AND fulfillment_date <= due_date THEN 'On-Time'
                        WHEN due_date IS NOT NULL AND fulfillment_date > due_date THEN 'Delayed'
                        ELSE 'No Due Date / Active'
                    END as delivery_status
                FROM orders_data
            """
            df_orders = db_conn.execute(orders_query).fetchdf()
            st.dataframe(df_orders, use_container_width=True)
            
            col1, col2 = st.columns(2)
            with col1:
                fig = px.histogram(df_orders, x='total_amount', nbins=20, title="Distribution of Order Amounts")
                st.plotly_chart(fig, use_container_width=True)
            with col2:
                fig = px.bar(df_orders, x='delivery_status', title="Delivery Performance Breakdown", color='delivery_status')
                st.plotly_chart(fig, use_container_width=True)
        else:
            st.warning("Orders dataset not loaded.")

    with tab3:
        st.subheader("Designer Workload & Custom Pipeline")
        if "design_log" in processed_dfs and "hr_roster" in processed_dfs:
            workload_query = """
                SELECT 
                    d.designer_id,
                    r.department,
                    r.role,
                    COUNT(d.design_id) as active_projects,
                    SUM(d.estimated_cost) as total_pipeline_value
                FROM design_log d
                LEFT JOIN hr_roster r ON d.designer_id = r.employee_id
                GROUP BY d.designer_id, r.department, r.role
                ORDER BY active_projects DESC
            """
            df_workload = db_conn.execute(workload_query).fetchdf()
            st.dataframe(df_workload, use_container_width=True)
            
            if not df_workload.empty:
                fig = px.bar(df_workload.head(10), x='designer_id', y='active_projects', color='department', title="Top Designer Workloads (Active Projects)", text_auto=True)
                st.plotly_chart(fig, use_container_width=True)
        elif "design_log" in processed_dfs:
            workload_query = """
                SELECT 
                    designer_id,
                    COUNT(design_id) as active_projects,
                    SUM(estimated_cost) as total_pipeline_value
                FROM design_log
                GROUP BY designer_id
                ORDER BY active_projects DESC
            """
            df_workload = db_conn.execute(workload_query).fetchdf()
            st.dataframe(df_workload, use_container_width=True)
            if not df_workload.empty:
                fig = px.bar(df_workload.head(10), x='designer_id', y='active_projects', title="Top Designer Workloads", text_auto=True)
                st.plotly_chart(fig, use_container_width=True)
        else:
            st.warning("Design log dataset not loaded.")

    with tab4:
        st.subheader("Financial Ledger & Account Category Breakdown")
        if "financial_ledger" in processed_dfs:
            fin_query = """
                SELECT 
                    account_category,
                    COUNT(transaction_id) as txn_count,
                    SUM(amount) as total_amount
                FROM financial_ledger
                GROUP BY account_category
                ORDER BY total_amount DESC
            """
            df_fin = db_conn.execute(fin_query).fetchdf()
            st.dataframe(df_fin, use_container_width=True)
            
            if not df_fin.empty:
                fig = px.bar(df_fin, x='account_category', y='total_amount', color='account_category', title="Financial Totals by Account Category", text_auto=True)
                st.plotly_chart(fig, use_container_width=True)
        else:
            st.warning("Financial ledger dataset not loaded.")

    with tab5:
        st.subheader("Human Resources & Inventory Audits")
        c1, c2 = st.columns(2)
        with c1:
            st.markdown("#### HR Roster by Department")
            if "hr_roster" in processed_dfs:
                hr_df = db_conn.execute("SELECT department, COUNT(*) as employee_count FROM hr_roster GROUP BY department").fetchdf()
                st.dataframe(hr_df, use_container_width=True)
                fig = px.pie(hr_df, names='department', values='employee_count', title="Department Headcount Distribution")
                st.plotly_chart(fig, use_container_width=True)
            else:
                st.info("HR roster not loaded.")
                
        with c2:
            st.markdown("#### Inventory Log Summary")
            if "inventory_log" in processed_dfs:
                inv_df = db_conn.execute("SELECT item_id, SUM(quantity_change) as net_change FROM inventory_log GROUP BY item_id LIMIT 15").fetchdf()
                st.dataframe(inv_df, use_container_width=True)
                fig = px.bar(inv_df, x='item_id', y='net_change', title="Net Quantity Change by Item", text_auto=True)
                st.plotly_chart(fig, use_container_width=True)
            else:
                st.info("Inventory log not loaded.")

if __name__ == "__main__":
    main()