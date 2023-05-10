const DataContract = {
    abi: {
        "ABI version": 2,
        "header": [
            "pubkey",
            "time",
            "expire"
        ],
        "functions": [
            {
                "name": "constructor",
                "inputs": [
                    {
                        "name": "addrOwner",
                        "type": "address"
                    },
                    {
                        "name": "codeIndex",
                        "type": "cell"
                    },
                    {
                        "name": "_name",
                        "type": "bytes"
                    },
                    {
                        "name": "_url",
                        "type": "bytes"
                    },
                    {
                        "name": "_editionNumber",
                        "type": "uint8"
                    },
                    {
                        "name": "_editionAmount",
                        "type": "uint8"
                    },
                    {
                        "name": "_managersList",
                        "type": "address[]"
                    },
                    {
                        "name": "_royalty",
                        "type": "uint8"
                    }
                ],
                "outputs": []
            },
            {
                "name": "transferOwnership",
                "inputs": [
                    {
                        "name": "addrTo",
                        "type": "address"
                    }
                ],
                "outputs": []
            },
            {
                "name": "getInfo",
                "inputs": [],
                "outputs": [
                    {
                        "name": "addrRoot",
                        "type": "address"
                    },
                    {
                        "name": "addrOwner",
                        "type": "address"
                    },
                    {
                        "name": "addrAuthor",
                        "type": "address"
                    },
                    {
                        "name": "addrData",
                        "type": "address"
                    },
                    {
                        "name": "id",
                        "type": "uint256"
                    },
                    {
                        "name": "name",
                        "type": "bytes"
                    },
                    {
                        "name": "url",
                        "type": "bytes"
                    },
                    {
                        "name": "number",
                        "type": "uint8"
                    },
                    {
                        "name": "amount",
                        "type": "uint8"
                    }
                ]
            },
            {
                "name": "getInfoResponsible",
                "inputs": [
                    {
                        "name": "_answer_id",
                        "type": "uint32"
                    }
                ],
                "outputs": [
                    {
                        "name": "addrRoot",
                        "type": "address"
                    },
                    {
                        "name": "addrOwner",
                        "type": "address"
                    },
                    {
                        "name": "addrAuthor",
                        "type": "address"
                    },
                    {
                        "name": "addrData",
                        "type": "address"
                    },
                    {
                        "name": "id",
                        "type": "uint256"
                    },
                    {
                        "name": "name",
                        "type": "bytes"
                    },
                    {
                        "name": "url",
                        "type": "bytes"
                    },
                    {
                        "name": "number",
                        "type": "uint8"
                    },
                    {
                        "name": "amount",
                        "type": "uint8"
                    }
                ]
            },
            {
                "name": "getOwner",
                "inputs": [],
                "outputs": [
                    {
                        "name": "addrOwner",
                        "type": "address"
                    }
                ]
            },
            {
                "name": "getOwnerResponsible",
                "inputs": [
                    {
                        "name": "_answer_id",
                        "type": "uint32"
                    }
                ],
                "outputs": [
                    {
                        "name": "addrOwner",
                        "type": "address"
                    }
                ]
            },
            {
                "name": "lendOwnership",
                "inputs": [
                    {
                        "name": "_addr",
                        "type": "address"
                    }
                ],
                "outputs": []
            },
            {
                "name": "returnOwnership",
                "inputs": [],
                "outputs": []
            },
            {
                "name": "getAllowance",
                "inputs": [],
                "outputs": [
                    {
                        "name": "addr",
                        "type": "address"
                    }
                ]
            },
            {
                "name": "burn",
                "inputs": [
                    {
                        "name": "_dest",
                        "type": "address"
                    }
                ],
                "outputs": []
            },
            {
                "name": "addManager",
                "inputs": [
                    {
                        "name": "_addr",
                        "type": "address"
                    }
                ],
                "outputs": []
            },
            {
                "name": "removeManager",
                "inputs": [
                    {
                        "name": "_addr",
                        "type": "address"
                    }
                ],
                "outputs": []
            },
            {
                "name": "getManagersList",
                "inputs": [],
                "outputs": [
                    {
                        "name": "managers",
                        "type": "address[]"
                    }
                ]
            },
            {
                "name": "resolveCodeHashIndex",
                "inputs": [
                    {
                        "name": "addrRoot",
                        "type": "address"
                    },
                    {
                        "name": "addrOwner",
                        "type": "address"
                    }
                ],
                "outputs": [
                    {
                        "name": "codeHashIndex",
                        "type": "uint256"
                    }
                ]
            },
            {
                "name": "resolveIndex",
                "inputs": [
                    {
                        "name": "addrRoot",
                        "type": "address"
                    },
                    {
                        "name": "addrData",
                        "type": "address"
                    },
                    {
                        "name": "addrOwner",
                        "type": "address"
                    }
                ],
                "outputs": [
                    {
                        "name": "addrIndex",
                        "type": "address"
                    }
                ]
            },
            {
                "name": "royalty",
                "inputs": [],
                "outputs": [
                    {
                        "name": "royalty",
                        "type": "uint8"
                    }
                ]
            }
        ],
        "data": [
            {
                "key": 1,
                "name": "_id",
                "type": "uint256"
            }
        ],
        "events": []
    },
    tvc: "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",
    code: "te6ccgECQAEADigAAgaK2zU/AQQkiu1TIOMDIMD/4wIgwP7jAvILPAQCPgEAAwL4jQhgAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAE+Gkh2zzTAAGOGoECANcYIPkBAdMAAZTT/wMBkwL4QuL5EPKoldMAAfJ64tM/AfhDIbnytCD4I4ED6KiCCBt3QKC58rT4Y9MfAfgjvPK50x8B2zz4R27yfCkFAWoi0NMD+kAw+GmpOAD4RH9vcYIImJaAb3Jtb3Nwb3T4ZNwhxwDcIdcNH/K8Id0B2zz4R27yfAUEUCCCEBkUQFq74wIgghAuBhbRu+MCIIIQYcgVa7vjAiCCEH3NmiK74wIgGBEGBFAgghBuMpTCuuMCIIIQc+KU/LrjAiCCEHdrmoC64wIgghB9zZoiuuMCDg0LBwOcMPhCbuMA0x/4RFhvdfhk0ds8KY45K9DTAfpAMDHIz4cgznHPC2FecVWAyM+T9zZois5VcMjOVWDIzlVQyM7L/8zMywfLB83Nzc3JcPsAOwkIAaqOTfhEIG8TIW8S+ElVAm8RyHLPQMoAc89AzgH6AvQAcc8LaV5xVYDI+ERvFc8LH85VcMjOVWDIzlVQyM7L/8zMywfLB83Nzc3J+ERvFPsA4uMAf/hnLQHYjQhgAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAEjQhgAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAEjQhgAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAECgKQjQhgAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAEcIiIcHD4RHBvcoBAb3T4ZPhL+Ez4Tfgo+E74T/hQ+FH4UmyZPj4DnDD4Qm7jAPpBldTR0PpA3/pBldTR0PpA39HbPCGOKCPQ0wH6QDAxyM+HIM6NBAAAAAAAAAAAAAAAAA92uagIzxbL/8lw+wCRMOLjAH/4ZzsMLQEUcF8i2zz5ADFsITQCuDD4Qm7jANGNCGAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAT4ViBu8n8xIY4fI9DTAfpAMDHIz4cgznHPC2EByM+Tz4pT8s7NyXD7AJEw4uMAf/hnOy0DkDD4Qm7jAPpBldTR0PpA39H4SfhMxwXy4GQg+FOBAQv0CiCRMd7y4Gn4AF8g+FOBAQv0WTAx+HNwliD4VG8QuY6A6FvbPH/4ZzsPLQH+IPhUbxGAIPQO8rIixwWOb/hUbyIiAVMSufKyjQhgAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAEWYAg9BZvAiD4dG8iIgFTErnysvhUbxCltf/4VG8RgCD0DvKyWYAg9BZvAiD4dG8iIfK2AaUgWIAg9FswbwL4dBAACN6ktQcEUCCCEC8ZJ4q64wIgghBb8EYMuuMCIIIQXAnkS7rjAiCCEGHIFWu64wIXFBMSAoQw+EJu4wDR+FQhji4j0NMB+kAwMcjPhyDOjQQAAAAAAAAAAAAAAAAOHIFWuM8WAW8iAssf9ADJcPsAkTDi4wB/+Gc7LQKgMPhCbuMA+kGV1NHQ+kDf0fhJ+EzHBfLgZCD4U4EBC/QKIJEx3vLQafgAIPhUbyIhpFUggCD0Fm8C+HQg+FN/yMoAWYEBC/RB+HMw2zx/+Gc7LQOcMPhCbuMA0ds8KY45K9DTAfpAMDHIz4cgznHPC2FecVWAyM+Tb8EYMs5VcMjOVWDIzlVQyM7L/8zMywfLB83Nzc3JcPsAkl8J4uMAf/hnOxUtAdiNCGAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAASNCGAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAASNCGAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAQWAoSNCGAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAARwiIhwcPhLOfhMOPhNN/goNl8E+E/4UPhOM/hR+FI+PgN0MPhCbuMA0fhJ+FYgbvJ/xwXy4Mn4J28QaKb+YKG1f3L7Ats8+EzIz4WIzoBvz0DJgQCA+wDbPH/4Zzs6LQRQIIIQG17kG7rjAiCCEB14ZMm64wIgghAepRdduuMCIIIQLgYW0brjAh8eHBkD1DD4Qm7jAPpBldTR0PpA39H4SfhTgQEL9AogkTHe8uBq+CdvEGim/mCCEAX14QChtX+htX9y+wL4Vm6zjiT4ScjPhYjOjQSAAAAAAAAAAAAAAAAAACDSdWXAzxbJgQCA+wCOgOIw2zx/+Gc7Gi0BSCDbPPhN+FX4ScjPhYjOcc8LblnIz5ETEb0mywfOzcmBAID7ABsABPh2A2Yw+EJu4wDR2zwhjh8j0NMB+kAwMcjPhyDOcc8LYQHIz5J6lF12zs3JcPsAkTDi4wB/+Gc7HS0ABPhMA5ww+EJu4wD6QZXU0dD6QN/6QZXU0dD6QN/6QZXU0dD6QN/R2zwhjh8j0NMB+kAwMcjPhyDOcc8LYQHIz5J14ZMmzs3JcPsAkTDi4wB/+Gc7Mi0BUjDR2zz4VSGOHI0EcAAAAAAAAAAAAAAAACbXuQbgyM7LB8lw+wDef/hnOwRQIIIQDgTSnrrjAiCCEA9ZcVe64wIgghAQERAbuuMCIIIQGRRAWrrjAiwkIiECYjD4Qm7jAPpBldTR0PpA39H4SfhMxwXy4GT4ACDIz4UIzoBvz0DJgQCg+wAw2zx/+Gc7LQPeMPhCbuMA0x/4RFhvdfhk0ds8IY4fI9DTAfpAMDHIz4cgznHPC2EByM+SQERAbs7NyXD7AI4z+EQgbxMhbxL4SVUCbxHIcs9AygBzz0DOAfoC9ABxzwtpAcj4RG8Vzwsfzs3J+ERvFPsA4uMAf/hnOyMtAGSNCGAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAT4RHBvcoBAb3T4ZDD4TAT+MPhCbuMA+Ebyc3/4ZvpBldTR0PpA3yDXSsABk9TR0N7UINdKwAGT1NHQ3tQg10vAAQHAALCT1NHQ3tTXDQeV1NHQ0wff1w0HldTR0NMH3yDHAZPU0dDe0x/0BFlvAgHXDQeV1NHQ0wff0fhBiMjPjits1szOyds8IG7y0GVfICk/JiUC3G7yf9D6QDD4SSHHBfLgy2im/mCCEDuaygC+8uBo+AAg+Gsp+Gwp+G0o+Gon+G8m+HAl+HEk+HJwlVMEbxC5jhz4U1MVbxGAIPQO8rIBf8jKAFmBAQv0QfhzpLUH6DAj+HQi+HUp2zxfCts8f/hnMC0CGNAgizits1jHBYqK4icoAQrXTdDbPCgAQtdM0IsvSkDXJvQEMdMJMYsvShjXJiDXSsIBktdNkjBt4gIW7UTQ10nCAYqOgOI7KgL+cO1E0PQFiPhqjQhgAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAE+GuNCGAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAT4bI0IYAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAABPhtcSGAQD4rAm70DpPXC/+RcOL4boj4b4j4cHD4cXD4cm34c3BtbwL4dHD4dW34doBA9A7yvdcL//hicPhjcPhmPj4DLjD4Qm7jAPpBldTR0PpA39HbPNs8f/hnOy4tALz4VvhV+FT4U/hS+FH4UPhP+E74TfhM+Ev4SvhG+EP4QsjL/8s/ygDMzlWgyM5VkMjOy//MzMsHywf0AFUgyAFvIgLLH/QAywcBIG6TMM+Bl8jOAc+DzxHizc3Nye1UA8b4SfhMxwUglDD4Vm7eII4TMPhWbrMgmzD4ViBu8n/4SccF3t/y4Mpopv5gghA7msoAvvLgaNs8+Ev4KPhM2zwgyM+FiM6NBU5iWgAAAAAAAAAAAAAAAAAAI+MW7UDPFslw+wA6Mi8CrI0IYAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAABPgo+EzbPCDIz4WIzo0FTmJaAAAAAAAAAAAAAAAAAAAj4xbtQM8WyXD7ACL4bCLbPF8DMjAE5PhLIds8IPgo2zz4S1MR+QDIz4oAQMv/WSLIz4WIzxONBJBfXhAAAAAAAAAAAAAAAAAAAcDPFszPgwHIz5EdWVNyzs3JcPsAMI0IYAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAABCPbPCD4KDQzNDEBgts8+EtTEfkAyM+KAEDL/1kiyM+FiM8TjQSQX14QAAAAAAAAAAAAAAAAAAHAzxbMz4MByM+RHVlTcs7NyXD7AF8GMwJ6jQhgAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAEUzHbPFMD2zz5AHDIz4ZAygfL/8nQMjBsMTQzAEhtcMjL/3BYgED0QyFxWIBA9BbI9ADJIsjPhID0APQAz4HJbCEBICHIzlzOMfhK0CHJ2zwxbCE1AhYhizits1jHBYqK4jc2AQgB2zzJOAEmAdTUMBLQ2zzIz44rbNYSzM8RyTgBZtWLL0pA1yb0BNMJMSDXSpHUjoDiiy9KGNcmMAHIz4vSkPQAgCDPCwnPi9KGzBLMyM8RzjkBBIgBPgAGbfh2ALTtRNDT/9M/0gDU+kDU0dD6QNTR0PpA0//U1NMH0wf0BNTR0NMf9ARZbwIB0wf0BAEgbpTQ+kAw3wHR+Hb4dfh0+HP4cvhx+HD4b/hu+G34bPhr+Gr4Zvhj+GICCvSkIPShPj0AFHNvbCAwLjQ3LjAAAAAMIPhh7R7Z",
    codeHash: "741ce2974b9a77d8e7a3ba6cfa4cb2fa81239f7d56472b62c9c620a6c9d0b3ea",
};
module.exports = { DataContract };