import { execSync } from "child_process"

const taskNumber = process.argv[2]
execSync(`ts-node ./${taskNumber}/${taskNumber}.ts`, { stdio: 'inherit' })