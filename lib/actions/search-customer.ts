'use server'

export type Customer = {
  id: number;
  name: string;
  email: string;
  company: string;
}

const mockCustomers: Customer[] = [
  { id: 1, name: 'John Doe', email: 'john@example.com', company: 'Acme Inc.' },
  { id: 2, name: 'Jane Smith', email: 'jane@example.com', company: 'Globex Corp' },
  { id: 3, name: 'Alice Johnson', email: 'alice@example.com', company: 'Umbrella Corp' },
  { id: 4, name: 'Bob Williams', email: 'bob@example.com', company: 'Initech' },
  { id: 5, name: 'Charlie Brown', email: 'charlie@example.com', company: 'Hooli' },
]

export async function searchCustomers(query: string): Promise<Customer[]> {
  await new Promise(resolve => setTimeout(resolve, 300))
  return mockCustomers.filter(customer => 
    customer.name.toLowerCase().includes(query.toLowerCase()) ||
    customer.email.toLowerCase().includes(query.toLowerCase()) ||
    customer.company.toLowerCase().includes(query.toLowerCase())
  )
}

